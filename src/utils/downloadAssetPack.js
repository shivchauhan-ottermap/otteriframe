import JSZip from "jszip";

const ASSET_PACKS = {
  img: {
    zipName: "aerial_imagery_pack.zip",
    files: [
      "aerial_imagery_pack/1.jpg",
      "aerial_imagery_pack/2.tiff",
      "aerial_imagery_pack/3.jpg",
    ],
  },
  layers: {
    zipName: "feature_layers.zip",
    files: [
      "feature_layers/GeoJSON/1.geojson",
      "feature_layers/GeoJSON/2.geojson",
      "feature_layers/GeoJSON/3.geojson",
      "feature_layers/ShapeFile/1.geojson",
      "feature_layers/ShapeFile/2.geojson",
      "feature_layers/ShapeFile/3.geojson",
    ],
  },
  brief: {
    fileName: "task_brief.pdf",
    path: "task_brief.pdf",
  },
};

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function hasAssetPack(assetId) {
  return Boolean(ASSET_PACKS[assetId]);
}

export async function downloadAssetPack(assetId) {
  const pack = ASSET_PACKS[assetId];
  if (!pack) {
    throw new Error("Download pack not configured for this asset.");
  }

  if (pack.path) {
    const response = await fetch(`/${pack.path}`);
    if (!response.ok) {
      throw new Error(`Failed to download ${pack.path}`);
    }
    triggerBlobDownload(await response.blob(), pack.fileName);
    return;
  }

  const zip = new JSZip();

  await Promise.all(
    pack.files.map(async (filePath) => {
      const response = await fetch(`/${filePath}`);
      if (!response.ok) {
        throw new Error(`Failed to download ${filePath}`);
      }
      zip.file(filePath, await response.blob());
    })
  );

  const blob = await zip.generateAsync({ type: "blob" });
  triggerBlobDownload(blob, pack.zipName);
}
