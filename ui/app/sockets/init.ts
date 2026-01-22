import { LIKE_TOGGLED_EVENT, THREAD_CREATED_EVENT } from "~/constants/events";
import type { ToggleLikeResponse } from "~/dto/like";
import type { Thread } from "~/dto/thread";
import { socket } from "~/lib/socket";
import { selectAuthUser } from "~/store/auth";
import { store } from "~/store/store";
import { likeToggled, selectThreadById, threadCreated } from "~/store/thread";

export function initSockets() {
    socket.connect();

    socket.on(THREAD_CREATED_EVENT, ({ tweet }: { tweet: Thread }) => {
          store.dispatch(threadCreated(tweet));
    });

    socket.on(LIKE_TOGGLED_EVENT, (response: ToggleLikeResponse) => {
        store.dispatch(likeToggled(response));
    });

}