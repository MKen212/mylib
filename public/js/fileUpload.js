/*global FilePond, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginFileEncode */

// Register FilePond Plugins
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
);

FilePond.setOptions({
  stylePanelAspectRatio: 150/100,
  imageResizeTargetHeight: 150,
  imageResizeTargetWidth: 100,
});

// Initialise FilePond
FilePond.parse(document.body);
