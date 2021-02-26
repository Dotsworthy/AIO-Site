export const triggerFormLock = (id) => {
  let nodes = document.getElementById(id).getElementsByTagName('*');
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

export const resetAllWarnings = () => {
  const warnings = ["no-name", "no-description", "no-category", "no-level", "no-tags", "no-image", "no-downloads",
    "duplicate-name", "max-tags-reached", "duplicate-tags", "duplicate-files", "file-too-large"]

  warnings.forEach(warning => {
    document.getElementById(warning).style.display = "none";
  })
}