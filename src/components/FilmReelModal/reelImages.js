/* Photos fed to the FilmReel experiment — a reel of travel/landscape frames.
   Unsplash serves CORS headers, so these load cleanly as WebGL textures
   (the reel draws them to a canvas and uploads it). Swap for /reel/NN.jpg
   files in public/reel/ if you'd rather host your own. */
const U = (id) =>
  `https://images.unsplash.com/${id}?w=1000&q=80&auto=format&fit=crop`;

export const REEL_IMAGES = [
  { src: U("photo-1501785888041-af3ef285b470"), alt: "Lago di Braies" },
  { src: U("photo-1470770841072-f978cf4d019e"), alt: "Lofoten Islands" },
  { src: U("photo-1472214103451-9374bd1c798e"), alt: "Black Forest" },
  { src: U("photo-1426604966848-d7adac402bff"), alt: "Banff" },
  { src: U("photo-1506905925346-21bda4d32df4"), alt: "Lake Bled" },
  { src: U("photo-1418065460487-3e41a6c84dc5"), alt: "Scottish Highlands" },
  { src: U("photo-1454496522488-7a8e488e8606"), alt: "Alpine ridge" },
  { src: U("photo-1469474968028-56623f02e42e"), alt: "Mountain valley" },
  { src: U("photo-1441974231531-c6227db76b6e"), alt: "Forest" },
  { src: U("photo-1433086966358-54859d0ed716"), alt: "Waterfall" },
];
