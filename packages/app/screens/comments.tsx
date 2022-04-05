import { Suspense, useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";

import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Comments } from "app/components/comments";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";

import { Modal, ModalSheet } from "design-system";

import { CommentsStatus } from "../components/comments/comments-status";

type Query = {
  nftId: number;
};

const { useParam } = createParam<Query>();

const snapPoints = ["90%"];

/**
 * extracted these number from react-navigation
 */
// @ts-ignore
const modalPresentationHeight = Platform.isPad
  ? 6
  : Platform.OS === "ios"
  ? 12
  : 0;

export function CommentsScreen() {
  const wasClosedByUserAction = useRef<boolean | undefined>(undefined);

  //#region hooks
  const isModalFocused = useIsFocused();
  const router = useRouter();
  const { top: topSafeArea } = useSafeAreaInsets();
  // @ts-ignore
  const [nftId, _] = useParam("nftId");
  //#endregion

  //#region callbacks
  const handleClose = useCallback(() => {
    wasClosedByUserAction.current = true;
    router.back();
  }, [router]);
  const handleOnClose = useCallback(() => {
    if (!isModalFocused) {
      return;
    }

    if (!wasClosedByUserAction.current) {
      wasClosedByUserAction.current = true;
      router.back();
    }
  }, [router, isModalFocused]);
  //#endregion

  const CommentsModal = Platform.OS === "android" ? ModalSheet : Modal;
  return (
    <CommentsModal
      title="Comments"
      snapPoints={snapPoints}
      height="h-[90vh]"
      close={handleClose}
      onClose={handleOnClose}
      keyboardVerticalOffset={topSafeArea + modalPresentationHeight}
      bodyTW="bg-white dark:bg-black"
      bodyContentTW="p-0"
      scrollable={false}
      visible={isModalFocused}
    >
      <Suspense
        fallback={<CommentsStatus isLoading={true} error={undefined} />}
      >
        <Comments nftId={nftId!} />
      </Suspense>
    </CommentsModal>
  );
}
