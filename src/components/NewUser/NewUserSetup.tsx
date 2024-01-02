import { Transition, Dialog } from "@headlessui/react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Fragment, useEffect } from "react";
import SetupSteps from "./NewUserSetupStep";
import { useUser } from "@thirdweb-dev/react";

export enum NewUserSetupStep {
  SetupWelcome,
  SetupUsername,
  SetupEmail,
  SetupImage,
}

interface NewUserSetupStateAtomType {
  username: string;
  email: string;
  image: string;
  isNewUser: boolean;
  steps: NewUserSetupStep;
}

export const newUserSetupStateAtom = atomWithStorage<NewUserSetupStateAtomType>(
  "new-user-setup-state",
  {
    username: "",
    email: "",
    image: "",
    isNewUser: false,
    steps: 2,
  }
);

function NewUserSetup() {
  const [userSetupState, setUserSetupState] = useAtom(newUserSetupStateAtom);
  const { user } = useUser();

  useEffect(() => {
    if (!userSetupState.isNewUser && user) {
      const user = fetch("/api/user/checkUser");
      user
        .then((val) => val.json())
        .then((userRes) => {
          if (userRes.isNewUser) {
            setUserSetupState((prevState) => ({
              ...prevState,
              steps: 0,
              ...userRes,
            }));
          }
        });
    }
  }, [user?.address]);

  const closeSetup = () => {
    setUserSetupState((prevState) => ({
      ...prevState,
      isNewUser: false,
    }));
  };

  return (
    <>
      <Transition appear show={userSetupState.isNewUser} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeSetup}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <SetupSteps />
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

export default NewUserSetup;
