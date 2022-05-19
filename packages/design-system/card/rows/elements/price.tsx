import { useMemo } from "react";

import { useNFTListings } from "app/hooks/api/use-nft-listings";
import { NFT } from "app/types";

import { useIsDarkMode } from "design-system/hooks";
import { Skeleton } from "design-system/skeleton";
import { Text } from "design-system/text";
import { View } from "design-system/view";

type Props = {
  nft?: NFT;
  options?: boolean;
};

export function Price({ nft }: Props) {
  //#region hooks
  const isDarkMode = useIsDarkMode();
  const { data, loading } = useNFTListings(nft?.nft_id);
  //#endregion

  //#region variables
  const price = useMemo(() => {
    const index = (data?.card_summary.length ?? 0) - 1;
    if (index === -1) {
      return "";
    }
    return `${data?.card_summary[index].listing?.min_price} ${data?.card_summary[index].listing?.currency}`;
  }, [data]);
  //#endregion

  if (
    !nft ||
    !data ||
    (!loading && data.card_summary.length > 0 && !data.card_summary[0].listing)
  )
    return null;

  return (
    <View tw="flex justify-end">
      <Text
        style={{ fontSize: 12 }}
        tw="text-right font-semibold text-gray-600 dark:text-gray-400"
      >
        🏷 Price
      </Text>
      <View tw="h-1" />
      <Skeleton
        show={loading}
        height={13}
        colorMode={isDarkMode ? "dark" : "light"}
      >
        <Text
          style={{ fontSize: 13, lineHeight: 14 }}
          tw="text-right font-bold uppercase text-gray-900 dark:text-white"
        >
          {price}
        </Text>
      </Skeleton>
    </View>
  );
}
