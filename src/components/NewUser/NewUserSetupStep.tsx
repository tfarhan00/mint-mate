import { useAtom, useAtomValue } from "jotai";
import { NewUserSetupStep, newUserSetupStateAtom } from "./NewUserSetup";
import { ChangeEventHandler, forwardRef, useState } from "react";
import { cnm } from "@/utils/style";
import { z } from "zod";
import { RESET } from "jotai/utils";

const SetupSteps = forwardRef<HTMLDivElement>(function SetupSteps(
  props,
  forwardedRef
) {
  const newUserSetupState = useAtomValue(newUserSetupStateAtom);

  if (newUserSetupState.steps === NewUserSetupStep.SetupWelcome)
    return <WelcomeStep {...props} forwardedRef={forwardedRef} />;
  if (newUserSetupState.steps === NewUserSetupStep.SetupUsername)
    return <UsernameStep {...props} forwardedRef={forwardedRef} />;
  if (newUserSetupState.steps === NewUserSetupStep.SetupEmail)
    return <EmailStep {...props} forwardedRef={forwardedRef} />;

  return <div ref={forwardedRef}></div>;
});

function WelcomeStep({ forwardedRef }: BaseSetupStepComponentProps) {
  const [userSetupState, setUserSetupState] = useAtom(newUserSetupStateAtom);

  const nextStep = () => {
    setUserSetupState((prevState) => ({
      ...prevState,
      steps: prevState.steps + 1,
    }));
  };

  return (
    <div
      ref={forwardedRef}
      className="fixed inset-0 z-50 bg-black/30 w-screen h-screen flex items-center justify-center px-5"
    >
      <div className="w-full max-w-md min-h-64 h-fit bg-white rounded-xl border p-6 flex flex-col">
        <div className="flex flex-col gap-2 items-center w-full py-4">
          <p className="text-xl font-semibold tracking-tight">
            Welcome to MintMate
          </p>
          <p className="font-medium text-black/50 text-center text-balance">
            You are about to join the world of renaissance digital arts, immerse
            yourself.
          </p>
        </div>
        <div className="w-full flex items-center justify-center gap-2 text-sm mt-auto">
          <button
            onClick={nextStep}
            className="bg-black font-bold tracking-wide text-white flex-1 rounded-lg py-2.5 px-5 flex items-center justify-center hover:bg-black/80"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function UsernameStep({ forwardedRef }: BaseSetupStepComponentProps) {
  const [{ username }, setUserSetupState] = useAtom(newUserSetupStateAtom);
  const [validationError, setValidationError] =
    useState<BaseSetupFormValdiation>({
      isError: false,
      errorMessage: "",
    });

  const usernameSchema = z.string().min(4).max(16);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValidationError((prevState) => ({
      ...prevState,
      isError: false,
      errorMessage: "",
    }));
    setUserSetupState((prevState) => ({
      ...prevState,
      username: event.target.value,
    }));
  };

  const nextStep = async () => {
    const isUsernameValid = await usernameSchema.safeParseAsync(username);

    if (!isUsernameValid.success) {
      setValidationError((prevState) => ({
        ...prevState,
        isError: true,
        errorMessage: isUsernameValid.error.issues[0].message,
      }));
      return;
    }

    // UPDATE Query to Prisma
    const queryPayload = {
      username,
    };

    const query = await fetch("/api/user/newUser", {
      method: "POST",
      body: JSON.stringify(queryPayload),
    });
    const queryResult = await query.json();

    if (!query.ok) {
      setValidationError((prevState) => ({
        ...prevState,
        isError: true,
        errorMessage: queryResult.message,
      }));
      return;
    }

    setUserSetupState((prevState) => ({
      ...prevState,
      steps: prevState.steps + 1,
    }));
  };

  const skipStep = () => {
    setUserSetupState((prevState) => ({
      ...prevState,
      steps: prevState.steps + 1,
    }));
  };

  return (
    <div
      ref={forwardedRef}
      className="fixed inset-0 z-50 bg-black/30 w-screen h-screen flex items-center justify-center px-5"
    >
      <div className="w-full max-w-md min-h-64 h-fit bg-white rounded-xl border p-6 flex flex-col">
        <div className="flex flex-col gap-4 items-center w-full h-full py-4">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-xl font-semibold tracking-tight">
              What&apos;s your name?
            </p>
            <p className="font-medium text-black/50 text-center text-balance">
              A mandatory step for you to be known, with a name you will be
              recognized.
            </p>
          </div>
          {/* Input */}
          <div className="flex flex-col w-full gap-2">
            <div
              className={cnm(
                "w-full border rounded-lg overflow-hidden py-2 px-4 mt-auto",
                validationError.isError ? "bg-red-100" : "bg-neutral-50"
              )}
            >
              <input
                onChange={handleInputChange}
                value={username}
                placeholder="What's your name?"
                className="bg-transparent outline-none placeholder:text-sm w-full"
              />
            </div>
            <p className="text-red-500 text-xs">
              {validationError.errorMessage}
            </p>
          </div>
        </div>
        <div className="w-full flex items-stretch justify-center gap-2 text-sm mt-auto">
          <button
            onClick={skipStep}
            className="text-gray-500 flex-1 rounded-lg py-2.5 px-5 flex items-center justify-center hover:bg-gray-200/30"
          >
            Skip
          </button>
          <button
            onClick={nextStep}
            className="bg-black font-bold tracking-wide text-white flex-1 rounded-lg py-2.5 px-5 flex items-center justify-center hover:bg-black/80"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailStep({ forwardedRef }: BaseSetupStepComponentProps) {
  const [{ email }, setUserSetupState] = useAtom(newUserSetupStateAtom);

  const [validationError, setValidationError] =
    useState<BaseSetupFormValdiation>({
      isError: false,
      errorMessage: "",
    });

  const emailSchema = z.string().email();

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValidationError((prevState) => ({
      ...prevState,
      isError: false,
      errorMessage: "",
    }));
    setUserSetupState((prevState) => ({
      ...prevState,
      email: event.target.value,
    }));
  };

  const nextStep = async () => {
    const isEmailValid = await emailSchema.safeParseAsync(email);

    if (!isEmailValid.success) {
      setValidationError((prevState) => ({
        ...prevState,
        isError: true,
        errorMessage: isEmailValid.error.issues[0].message,
      }));
      return;
    }
    // UPDATE Query to Prisma
    const queryPayload = {
      email,
      isNewUser: false,
    };

    const query = await fetch("/api/user/newUser", {
      method: "POST",
      body: JSON.stringify(queryPayload),
    });
    const queryResult = await query.json();

    if (!query.ok) {
      setValidationError((prevState) => ({
        ...prevState,
        isError: true,
        errorMessage: queryResult.message,
      }));
      return;
    }

    setUserSetupState((prevState) => ({ ...prevState, isNewUser: false }));
    setTimeout(() => setUserSetupState(RESET), 1500);
  };

  const skipStep = async () => {
    // UPDATE Query to Prisma
    const queryPayload = {
      isNewUser: false,
    };

    const query = await fetch("/api/user/newUser", {
      method: "POST",
      body: JSON.stringify(queryPayload),
    });
    const queryResult = await query.json();

    if (!query.ok) {
      setValidationError((prevState) => ({
        ...prevState,
        isError: true,
        errorMessage: queryResult.message,
      }));
      return;
    }

    setUserSetupState((prevState) => ({ ...prevState, isNewUser: false }));
    setTimeout(() => setUserSetupState(RESET), 1500);
  };

  return (
    <div
      ref={forwardedRef}
      className="fixed inset-0 z-50 bg-black/30 w-screen h-screen flex items-center justify-center px-5"
    >
      <div className="w-full max-w-md min-h-64 h-fit bg-white rounded-xl border p-6 flex flex-col">
        <div className="flex flex-col gap-4 items-center w-full h-full py-4">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-xl font-semibold tracking-tight">
              Email Address
            </p>
            <p className="font-medium text-black/50 text-center text-balance">
              You will receive our alerts, newsletter and notifications.
            </p>
          </div>
          {/* Input */}
          <div className="flex flex-col w-full gap-2">
            <div
              className={cnm(
                "w-full border rounded-lg overflow-hidden py-2 px-4 mt-auto",
                validationError.isError ? "bg-red-100" : "bg-neutral-50"
              )}
            >
              <input
                onChange={handleInputChange}
                value={email}
                placeholder="What's your email?"
                className="bg-transparent outline-none placeholder:text-sm w-full"
              />
            </div>
            <p className="text-red-500 text-xs">
              {validationError.errorMessage}
            </p>
          </div>
        </div>
        <div className="w-full flex items-stretch justify-center gap-2 text-sm mt-auto">
          <button
            onClick={skipStep}
            className="text-gray-500 flex-1 rounded-lg py-2.5 px-5 flex items-center justify-center hover:bg-gray-200/30"
          >
            Skip
          </button>
          <button
            onClick={nextStep}
            className="bg-black font-bold tracking-wide text-white flex-1 rounded-lg py-2.5 px-5 flex items-center justify-center hover:bg-black/80"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

interface BaseSetupStepComponentProps {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}

interface BaseSetupFormValdiation {
  isError: boolean;
  errorMessage: string;
}

export default SetupSteps;
