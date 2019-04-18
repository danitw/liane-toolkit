import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { ReactiveVar } from "meteor/reactive-var";

import Modal from "../components/Modal.jsx";

const title = new ReactiveVar(false);
const content = new ReactiveVar(false);

let onClose = false;

class ModalStore {
  setTitle(t) {
    title.set(t);
  }
  set(c, cb) {
    content.set(c);
    if (cb) {
      onClose = cb;
    }
  }
  reset(force) {
    if (force || !onClose) {
      title.set(false);
      content.set(false);
    } else if (onClose()) {
      title.set(false);
      content.set(false);
    }
    onClose = false;
  }
}

export const modalStore = new ModalStore();

export default withTracker(() => {
  return {
    children: content.get(),
    title: title.get()
  };
})(Modal);
