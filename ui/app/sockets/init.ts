import { LIKE_TOGGLED_EVENT, THREAD_CREATED_EVENT } from "~/constants/events";
import type { ToggleLikeResponse } from "~/dto/like";
import type { Thread } from "~/dto/thread";
import { socket } from "~/lib/socket";
import { selectAuthUser } from "~/store/auth";
import { store } from "~/store/store";
import { likeToggled, threadCreated } from "~/store/thread";
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

    socket.on(LIKE_TOGGLED_EVENT, (response: ToggleLikeResponse) => {
        store.dispatch(likeToggled(response));
    });

}