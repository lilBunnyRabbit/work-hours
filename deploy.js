import ghpages from "gh-pages";

const dir = "dist";

console.log(`Deploying "${dir}"...`);

ghpages.publish(dir, (error) => {
  if (error) {
    return console.error(error);
  }

  console.log(`"${dir}" has been successfully deployed!`);
});
