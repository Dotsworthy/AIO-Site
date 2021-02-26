
  export const triggerFormLock = () => {
    let nodes = document.getElementById("add-item-form").getElementsByTagName('*');
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].disabled = !nodes[i].disabled;
    }
  }

  export const disableScroll = () => {
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
  }

  export const enableScroll = () => {
    document.body.style.overflow = null;
    document.body.style.height = null;
  }

  