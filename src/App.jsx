import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {

  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

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
              <div>{ind+1} - &nbsp;&nbsp;&nbsp;</div>
              <div>{project._id} <span className="text-[8px] font-bold text-gray-500">PROJECT_ID</span></div>
              <div className="ml-auto bg-[rgb(255,127,80)] px-4 py-1 text-xs rounded cursor-pointer" onClick={()=>navigate("/view/"+project._id)}>VIEW</div>
              <div className="ml-2.5 bg-[rgb(148,255,112)] px-4 py-1 text-xs rounded cursor-pointer" onClick={()=>navigate("/editor/"+project._id)}>EDIT</div>
            </div>
          ))
        }
        <div className=" bg-green-600 text-white font-bold text-center py-[10px] w-[30%] cursor-pointer m-auto rounded-md" onClick={async () => {

          const data = await axios.post("https://pdfbackend-cdcz.onrender.com/project", {});
          navigate("/editor/" + data.data.project._id);

        }}>Create a new project</div>
      </div>
    </div>
  );
}

export default App;
