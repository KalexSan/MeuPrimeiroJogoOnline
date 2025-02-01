export default function createKeybordListener(document) {
    const state = {
      observer: [],
    };

    function registerPlayerId(playerId) {
      state.playerId = playerId;
    }

    function subscribe(observerFunction) {
      state.observer.push(observerFunction);
    }

    function notifyAll(command) {

      for (const observerFunction of state.observer) {
        observerFunction(command);
      }
    }

    document.addEventListener("keydown", handleKeydown);

    function handleKeydown(event) {
      const keyPressed = event.key;

      const command = {
        type: "move-player",
        playerId: state.playerId,
        keyPressed,
      };

      notifyAll(command);
    }

    return {
      subscribe,
      registerPlayerId
    }
  }