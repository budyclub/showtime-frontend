import { useState, useEffect, useContext } from "react";
import _ from "lodash";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import TokenSquareV3 from "./TokenSquareV3";

const TokenGridV3 = ({ items }) => {
  const context = useContext(AppContext);

  const [itemsList, setItemsList] = useState([]);
  const [itemsLikedList, setItemsLikedList] = useState([]);
  const [myItemLikes, setMyItemLikes] = useState([]);

  useEffect(() => {
    setItemsList(
      items
        .slice(0, 8)
        .filter(
          (item) =>
            item.token_hidden !== true &&
            (item.token_img_url ||
              item.contract_address ===
                "0xc2c747e0f7004f9e8817db2ca4997657a7746928")
        )
    );
  }, [items]);

  useEffect(() => {
    setMyItemLikes(context.myLikes ? context.myLikes : []);
  }, [context.myLikes]);

  const handleLike = async ({ tid }) => {
    // Change myLikes via setMyLikes

    context.setMyLikes([...context.myLikes, tid]);

    // Update the like counts for each item
    var newItemsList = [...itemsList];
    _.forEach(newItemsList, function (item) {
      if (item.tid === tid) {
        item.like_count = item.like_count + 1;
      }
    });
    setItemsList(newItemsList);

    // Post changes to the API
    await fetch(`/api/like/${tid}`, {
      method: "post",
    });

    mixpanel.track("Liked item");
  };

  const handleUnlike = async ({ tid }) => {
    // Change myLikes via setMyLikes
    context.setMyLikes(context.myLikes.filter((item) => !(item === tid)));

    // Update the like counts for each item
    var newItemsList = [...itemsList];
    _.forEach(newItemsList, function (item) {
      if (item.tid === tid) {
        item.like_count = item.like_count - 1;
      }
    });
    setItemsList(newItemsList);

    // Post changes to the API
    await fetch(`/api/unlike/${tid}`, {
      method: "post",
    });

    mixpanel.track("Unliked item");
  };

  // Augment content with my like status
  useEffect(() => {
    const newItemsLikedList = [];
    _.forEach([...itemsList], function (item) {
      item.liked = false;
      _.forEach([...myItemLikes], function (like) {
        if (item.tid === like) {
          item.liked = true;
        }
      });

      newItemsLikedList.push(item);
    });
    setItemsLikedList(newItemsLikedList);
  }, [itemsList, myItemLikes]);

  const [columns, setColumns] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 820) {
      setColumns(1);
      setIsMobile(true);
    } else if (context.windowSize && context.windowSize.width < 1190) {
      setColumns(2);
      setIsMobile(false);
    } else if (context.windowSize && context.windowSize.width < 1590) {
      setColumns(3);
      setIsMobile(false);
    } else {
      setColumns(4);
      setIsMobile(false);
    }
  }, [context.windowSize]);

  return columns ? (
    <div className={`grid grid-cols-${columns}`}>
      {itemsLikedList.map((item) => {
        return (
          <TokenSquareV3
            key={item.tid}
            item={item}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            columns={columns}
          />
        );
      })}
    </div>
  ) : null;
};

export default TokenGridV3;
