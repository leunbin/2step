let topBannerImageIdx = 0;
let eventBannerImagesIdx = 0;

const images = [
  "https://mir-s3-cdn-cf.behance.net/project_modules/1400/37b4b545787265.583d4f62e81fc.jpg",
  "https://i.pinimg.com/originals/d1/26/8f/d1268f371c94a120b18a580e364f9d9b.png",
  "https://ecimg.cafe24img.com/pg90b05313110010/brooksrunning/web/upload/appfiles/ZaReJam3QiELznoZeGGkMG/b879ca327dc52ccb1cbdcbbfd0d8ee13.jpg",
];

const eventImages = [
  "https://i.pinimg.com/originals/61/4c/b0/614cb0c5f9dc0b0f3750f4fc83b8cadc.jpg",
  "https://i.pinimg.com/originals/e5/f2/83/e5f2831488a5d72b0b00f50fcfe471d6.jpg",
];

const weeklyImage = [
  "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/92952171643077.5bccafb9d28f5.jpg",
];

const weeklyBestBannerImage = document.getElementById("weeklyBestBannerImage");
weeklyBestBannerImage.src = weeklyImage[0];

function changeImage() {
  const topBannerImage = document.getElementById("bannerImage");
  const eventBannerImage = document.getElementById("eventBannerImage");

  topBannerImage.src = images[topBannerImageIdx];
  eventBannerImage.src = eventImages[eventBannerImagesIdx];

  topBannerImageIdx = (topBannerImageIdx + 1) % images.length;
  eventBannerImagesIdx = (eventBannerImagesIdx + 1) % eventImages.length;
}

changeImage();

setInterval(changeImage, 4000);
