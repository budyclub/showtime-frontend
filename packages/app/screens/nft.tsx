import { Suspense } from "react";
import { Dimensions, useWindowDimensions, Platform } from "react-native";

import Head from "next/head";

import { ErrorBoundary } from "app/components/error-boundary";
import { FeedItem } from "app/components/swipe-list";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { useSafeAreaFrame } from "app/lib/safe-area";
import { createParam } from "app/navigation/use-param";

import { Skeleton, View } from "design-system";
import { useColorScheme } from "design-system/hooks";

type Query = {
  tokenId: string;
  contractAddress: string;
  chainName: string;
};

const { useParam } = createParam<Query>();
const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

function NftScreen() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <View tw="items-center">
            <Skeleton
              colorMode={colorScheme}
              height={screenHeight - 300}
              width={screenWidth}
            />
            <View tw="h-2" />
            <Skeleton
              colorMode={colorScheme}
              height={300}
              width={screenWidth}
            />
          </View>
        }
      >
        <NFTDetail />
      </Suspense>
    </ErrorBoundary>
  );
}

const NFTDetail = () => {
  const [tokenId] = useParam("tokenId");
  const [contractAddress] = useParam("contractAddress");
  const [chainName] = useParam("chainName");
  const { data } = useNFTDetailByTokenId({
    chainName,
    tokenId,
    contractAddress,
  });
  const headerHeight = useHeaderHeight();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { height: safeAreaFrameHeight } = useSafeAreaFrame();
  const { height: windowHeight } = useWindowDimensions();

  const itemHeight =
    Platform.OS === "web"
      ? windowHeight - headerHeight - safeAreaBottom
      : Platform.OS === "android"
      ? safeAreaFrameHeight - headerHeight
      : screenHeight;
  const item = data?.data?.item;

  if (item) {
    return (
      <>
        <Head>
          <title>{item.token_name} | Showtime</title>

          <meta name="description" content={item.token_description} />
          <meta property="og:type" content="website" />
          <meta name="og:description" content={item.token_description} />
          <meta
            property="og:image"
            content={
              item.token_img_twitter_url
                ? item.token_img_twitter_url
                : item.token_img_url
            }
          />
          <meta name="og:title" content={item.token_name} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={item.token_name} />
          <meta name="twitter:description" content={item.token_description} />
          <meta
            name="twitter:image"
            content={
              item.token_img_twitter_url
                ? item.token_img_twitter_url
                : item.token_img_url
            }
          />
        </Head>

        <FeedItem
          itemHeight={itemHeight}
          bottomPadding={safeAreaBottom}
          nft={data.data.item}
        />
      </>
    );
  }

  return null;
};

export { NftScreen };
