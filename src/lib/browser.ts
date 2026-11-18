// Full page loads to other origins go through here, so tests can watch them (location.assign can't be spied on).
export const browser = {
  open(url: string) {
    globalThis.location.assign(url);
  },
};
