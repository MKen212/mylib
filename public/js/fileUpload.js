/*global FilePond, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginFileEncode */
const rootStyles = window.getComputedStyle(document.documentElement);

if (rootStyles.getPropertyValue("--book-image-width-large") != null && rootStyles.getPropertyValue("--book-image-width-large") != "" ) {
  ready();
} else {
  document.getElementById("main-css").addEventListener("load", ready);
}

function ready() {
  let imageWidth = parseFloat(rootStyles.getPropertyValue("--book-image-width"));
  let imageAspectRatio = parseFloat(rootStyles.getPropertyValue("--book-image-aspect-ratio"));
  let imageHeight = imageWidth / imageAspectRatio;

  // Register FilePond Plugins
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  );

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / imageAspectRatio,
    imageResizeTargetHeight: imageHeight,
    imageResizeTargetWidth: imageWidth,
  });

  // Initialise FilePond
  FilePond.parse(document.body);
}
