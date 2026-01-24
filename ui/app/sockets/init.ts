import { LIKE_REPLY_TOGGLED_EVENT, LIKE_THREAD_TOGGLED_EVENT, REPLY_CREATED_EVENT, THREAD_CREATED_EVENT } from "~/constants/events";
import type { ToggleLikeResponse, ToggleReplyLikeResponse } from "~/dto/like";
import type { Reply, ReplyThreadMetadata } from "~/dto/reply";
import type { Thread } from "~/dto/thread";
import { socket } from "~/lib/socket";
import { selectAuthUser } from "~/store/auth";
import { replyCreated, replyLikeToggled } from "~/store/reply";
import { store } from "~/store/store";
import { threadLikeToggled } from "~/store/thread";
import { threadCreated, threadReplyCreated } from "~/store/threads";
import { toastSuccess } from "~/utils/toast";

export function initSockets() {
    socket.connect();

    socket.on(THREAD_CREATED_EVENT, ({ tweet }: { tweet: Thread }) => {
          store.dispatch(threadCreated(tweet));

          const user = selectAuthUser(store.getState());

        // cannot broadcast on backend because we dont 
        // emit socket event in socket listener, use this
        // manual check instead.
        if (tweet.user.id !== user?.user_id) {
            toastSuccess("New post available!");
        }
    });

    socket.on(REPLY_CREATED_EVENT, ({ reply, metadata }: { reply: Reply; metadata: ReplyThreadMetadata }) => {
          store.dispatch(replyCreated(reply));
          store.dispatch(threadReplyCreated(metadata));
          
    });

    socket.on(LIKE_THREAD_TOGGLED_EVENT, (response: ToggleLikeResponse) => {
        store.dispatch(threadLikeToggled(response));
    });

        socket.on(LIKE_REPLY_TOGGLED_EVENT, (response: ToggleReplyLikeResponse) => {
        store.dispatch(replyLikeToggled(response));
    });

}