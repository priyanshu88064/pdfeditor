import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    window.mobileCheck = function () {
      let check = false;
      (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    };

    if (window.mobileCheck()) {
      alert("App is not yet optimised for MOBILE. Please open in DESKTOP!");
    }

  }, []);




  useEffect(() => {

    const getProjects = async () => {
      const response = await axios.get("https://pdfbackend-cdcz.onrender.com/project");
      setProjects(response.data.projects);
    }

    getProjects();

  }, []);

  return (
    <div className=" p-[50px]">
      <div className="w-[50%] m-auto rounded-lg p-[20px] bg-grayx min-h-[200px]">
        <div className=" text-center mb-[30px]">MY PROJECTS</div>
        {
          projects.map((project, ind) => (
            <div key={ind} className="bg-white flex p-2.5 rounded mb-7">
              <div>{ind + 1} - &nbsp;&nbsp;&nbsp;</div>
              <div>{project._id} <span className="text-[8px] font-bold text-gray-500">PROJECT_ID</span></div>
              <div className="ml-auto bg-[rgb(255,127,80)] px-4 py-1 text-xs rounded cursor-pointer" onClick={() => navigate("/view/" + project._id)}>VIEW</div>
              <div className="ml-2.5 bg-[rgb(148,255,112)] px-4 py-1 text-xs rounded cursor-pointer" onClick={() => navigate("/editor/" + project._id)}>EDIT</div>
            </div>
          ))
        }
        <div className=" bg-green-600 text-white font-bold text-center py-[10px] w-[30%] cursor-pointer m-auto rounded-md" onClick={async () => {

          const data = await axios.post("https://pdfbackend-cdcz.onrender.com/project", {});
          navigate("/editor/" + data.data.project._id);

        }}>Create a new project</div>
      </div>
      <div className="text-center text-[13px] mt-2">*data fetching from backend can be slow because of hosting service used for this project (render)</div>
    </div>
  );
}

export default App;
