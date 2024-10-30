import { Rnd } from "react-rnd";
import styles from "./css/style.module.css";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default () => {
    const [textBoxes, setTextBoxes] = useState([]);
    const [checkBoxes, setCheckBoxes] = useState([]);
    const [radioButtons, setRadioButtons] = useState([{}]);
    const [dropdowns, setDropdowns] = useState([{}]);
    const [pdfFile, setPdfFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [project, setProject] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        const getPDF = async () => {

            try {
                const response = await axios.get('https://pdfbackend-cdcz.onrender.com/project/pdf/' + id, {
                    responseType: 'blob'
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                setPdfFile(url);
            } catch (err) {
                console.log(err)
            }
        }

        const getINFO = async () => {
            try {
                const response = await axios.get('https://pdfbackend-cdcz.onrender.com/project/info/' + id);
                setProject(response.data.project);
            } catch (err) {
                console.log(err)
            }
        }

        getPDF();
        getINFO();
    }, [id]);

    console.log(pdfFile)

    useEffect(() => {
        setTextBoxes(project?.textBoxes);
        setCheckBoxes(project?.checkBoxes);
        setRadioButtons(project?.radioButtons);
        setDropdowns(project?.dropdowns);
    }, [project]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };


    return (
        <div className="flex h-[100vh]">
            <div>
            </div>
            <div className="flex-1">
                {
                    pdfFile ?
                        <div className="border border-solid w-[700px] mx-auto">
                            <Document
                                file={pdfFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                {Array.from(new Array(numPages), (el, index) => (
                                    <Page renderAnnotationLayer={false} renderTextLayer={false} key={`page_${index + 1}`} pageNumber={index + 1} />
                                ))}
                            </Document>
                            {
                                textBoxes?.map((data, index) => (
                                    <Rnd
                                        enableResizing={false}
                                        disableDragging={true}
                                        key={`input_${index}`}
                                        className="border border-solid overflow-hidden p-1.5 bg-black"
                                        size={{ width: data.width, height: data.height }}
                                        position={{ x: data.x, y: data.y }}
                                        bounds="parent"
                                    >
                                        <input className={styles.rndTextInput} type="text" value={data.value} contentEditable={false} />
                                    </Rnd>

                                ))
                            }
                            {
                                checkBoxes?.map((data, index) => (
                                    <Rnd
                                        disableDragging={true}
                                        enableResizing={false}
                                        key={`check_${index}`}
                                        className="bg-[rgba(255,166,0)] overflow-hidden p-2.5"
                                        size={{ width: data.width, height: data.height }}
                                        position={{ x: data.x, y: data.y }}
                                        bounds="parent"
                                    >
                                        <input className="w-[20px] h-[20px] m-auto" type="checkbox" checked={data.isChecked} contentEditable={false} />
                                        <input className={styles.rndCheckInput} type="text" value={data.value} contentEditable={false} />
                                    </Rnd>
                                ))
                            }
                            {
                                radioButtons?.map((data, index) => (
                                    <Rnd
                                        disableDragging={true}
                                        enableResizing={false}
                                        key={`radio_${index}`}
                                        className="overflow-hidden bg-yellow-300 p-2.5"
                                        size={{ width: data.width, height: data.height }}
                                        position={{ x: data.x, y: data.y }}
                                        bounds="parent"
                                    >
                                        <div>
                                            <input contentEditable={false} checked={data.value === "cpp"} name={`coding_${index}`} type="radio" id={`cpp_${index}`} value="cpp" />
                                            <label for={`cpp_${index}`}>C++</label><br />
                                            <input contentEditable={false} checked={data.value === "java"} name={`coding_${index}`} type="radio" id={`java_${index}`} value="java" />
                                            <label for={`java_${index}`}>JAVA</label><br />
                                            <input contentEditable={false} checked={data.value === "python"} name={`coding_${index}`} type="radio" id={`python_${index}`} value="python" />
                                            <label for={`python_${index}`}>PYTHON</label><br />
                                        </div>
                                    </Rnd>
                                ))
                            }
                            {
                                dropdowns?.map((data, index) => (
                                    <Rnd
                                        disableDragging={true}
                                        enableResizing={false}
                                        key={`drop_${index}`}
                                        className="bg-[rgb(4,0,255)] p-5"
                                        size={{ width: data.width, height: data.height }}
                                        position={{ x: data.x, y: data.y }}
                                        bounds="parent"
                                    >
                                        <select className=" overflow-hidden p-2.5 m-auto" value={data.value} contentEditable={false}>
                                            <option value="0">MY Favorite game</option>
                                            <option value="1">Witcher 3</option>
                                            <option value="2">BGMI</option>
                                            <option value="3">RDR2</option>
                                            <option value="4">SEKIRO</option>
                                            <option value="5">ELDEN RING</option>
                                            <option value="6">BLOODBORNE</option>
                                        </select>
                                    </Rnd>
                                ))
                            }
                        </div> :
                        <div className=" flex justify-center items-center h-full">
                            <div>NO PDF PRESENT IN THIS PROJECT</div>
                        </div>
                }

            </div>
        </div>
    );

}