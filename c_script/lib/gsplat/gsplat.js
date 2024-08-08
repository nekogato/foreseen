import * as SPLAT from "https://cdn.jsdelivr.net/npm/gsplat@latest";

const canvas = document.getElementById("canvas");
const progressDialog = document.getElementById("progress-dialog");
const progressIndicator = document.getElementById("progress-indicator");

const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);

async function main() {
  // Load and convert ply from url
  const url = $(".file_url").attr("data-file");
  await SPLAT.PLYLoader.LoadAsync(url, scene, (progress) => (
    $(".progress-bar").css("width",progress * 100+"%")
  ));
  progressDialog.close();
  for (let i = 0; i < scene.objects.length; i++) {
    if($(window).width()<1024){
      scene.objects[i].scale={
          x:2,
          y:2,
          z:2
      }
    }else{
      scene.objects[i].scale={
          x:5,
          y:5,
          z:5
      }
    }
    //scene.objects[i].scale(10,10,10)
  }


  // Render loop
  const frame = () => {
    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

main();
