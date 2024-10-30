import { Rnd } from "react-rnd";
import styles from "./css/style.module.css";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default () => {
    const [textBoxes, setTextBoxes] = useState([{}]);
    const [checkBoxes, setCheckBoxes] = useState([{}]);
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

    useEffect(() => {
        setTextBoxes(project?.textBoxes);
        setCheckBoxes(project?.checkBoxes);
        setRadioButtons(project?.radioButtons);
        setDropdowns(project?.dropdowns);
    }, [project]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            alert("Please upload a valid PDF file.");
        }
    };

    const saveAndExit = async () => {

        if (!pdfFile) {
            return alert("Please select a pdf file to save!");
        }

        const formData = new FormData();
        if (!project.filePath) {
            formData.append("pdf", pdfFile);
        }
        formData.append("textBoxes", JSON.stringify(textBoxes));
        formData.append("checkBoxes", JSON.stringify(checkBoxes));
        formData.append("radioButtons", JSON.stringify(radioButtons));
        formData.append("dropdowns", JSON.stringify(dropdowns));
        formData.append("id", id);

        const response = axios.post('https://pdfbackend-cdcz.onrender.com/project/save', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        navigate(-1);

    }

    return (
        <div className=" flex h-[100vh]">
            <div>
                <div className="bg-white p-8 flex flex-col gap-8 fixed border border-black">
                    <div className="active:shadow-none hover:bg-[rgb(212,212,212)] rounded border border-[rgb(174,174,174)] p-1.5 bg-[rgba(226,226,226,0.69)] text-sm cursor-pointer shadow-[1px_1px_1px_black] transition-all duration-200" onClick={() => {
                        if (pdfFile) {
                            setTextBoxes(prev => ([...prev, { width: '200px', height: '35px', x: 50, y: 50, value: 'ENTER TEXT' }]));
                        } else {
                            alert("Please select a PDF File first!");
                        }
                    }}>+ TEXT FIELD</div>
                    <div className="active:shadow-none hover:bg-[rgb(212,212,212)] rounded border border-[rgb(174,174,174)] p-1.5 bg-[rgba(226,226,226,0.69)] text-sm cursor-pointer shadow-[1px_1px_1px_black] transition-all duration-200" onClick={() => {
                        if (pdfFile) {
                            setCheckBoxes(prev => ([...prev, { width: '200px', height: '60px', x: 50, y: 50, isChecked: true, value: 'CHECKBOX NAME' }]));
                        } else {
                            alert("Please select a PDF File first!");
                        }
                    }}>+ CHECKBOXES</div>
                    <div className="active:shadow-none hover:bg-[rgb(212,212,212)] rounded border border-[rgb(174,174,174)] p-1.5 bg-[rgba(226,226,226,0.69)] text-sm cursor-pointer shadow-[1px_1px_1px_black] transition-all duration-200" onClick={() => {
                        if (pdfFile) {
                            setRadioButtons(prev => (prev ? [...prev, { width: '150px', height: '100px', x: 50, y: 50, value: '' }] : [{ width: '150px', height: '100px', x: 50, y: 50, value: '' }]));
                        } else {
                            alert("Please select a PDF File first!");
                        }
                    }}>+ RADIO BUTTONS</div>
                    <div className="active:shadow-none hover:bg-[rgb(212,212,212)] rounded border border-[rgb(174,174,174)] p-1.5 bg-[rgba(226,226,226,0.69)] text-sm cursor-pointer shadow-[1px_1px_1px_black] transition-all duration-200" onClick={() => {
                        if (pdfFile) {
                            setDropdowns(prev => (prev ? [...prev, { width: '195px', height: '80px', x: 50, y: 50, value: '0' }] : [{ width: '195px', height: '80px', x: 50, y: 50, value: '0' }]));
                        } else {
                            alert("Please select a PDF File first!");
                        }
                    }}>+ DROPDOWN MENUS</div>
                    <div className=" active:shadow-none bg-green-500 text-white text-center p-1.5 rounded cursor-pointer shadow-[1px_1px_5px_black] transition-all duration-200" onClick={saveAndExit}>SAVE & EXIT</div>
                </div>
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
                                        key={`input_${index}`}
                                        className="border border-solid overflow-hidden p-1.5 bg-black"
                                        size={{ width: data.width, height: data.height }}
                                        position={{ x: data.x, y: data.y }}
                                        bounds="parent"
                                        onDragStop={(e, dir) => {
                                            setTextBoxes(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].x = dir.x;
                                                prevInput[index].y = dir.y;

                                                return prevInput;

                                            });
                                        }}
                                        onResizeStop={(_a, _aa, ref, _aaa, _aaaa) => {
                                            setTextBoxes(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].width = ref.style.width;
                                                prevInput[index].height = ref.style.height;

                                                return prevInput;
                                            });
                                        }}
                                    >
                                        <input className={styles.rndTextInput} type="text" value={data.value} onChange={(e) => {
                                            setTextBoxes(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].value = e.target.value;

                                                return prevInput;

                                            });
                                        }} />
                                    </Rnd>

                                ))
                            }
                            {
                                checkBoxes?.map((data, index) => (
                                    <Rnd
                                        key={`check_${index}`}
                                        className="bg-[rgba(255,166,0)] overflow-hidden p-2.5"
                                        size={{ width: data.width, height: data.height }}
                                        position={{ x: data.x, y: data.y }}
                                        bounds="parent"
                                        onDragStop={(e, dir) => {
                                            setCheckBoxes(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].x = dir.x;
                                                prevInput[index].y = dir.y;

                                                return prevInput;

                                            });
                                        }}
                                        onResizeStop={(_a, _aa, ref, _aaa, _aaaa) => {
                                            setCheckBoxes(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].width = ref.style.width;
                                                prevInput[index].height = ref.style.height;

                                                return prevInput;
                                            });
                                        }}
                                    >
                                        <input className="w-[20px] h-[20px] m-auto" type="checkbox" checked={data.isChecked} onChange={(e) => {
                                            setCheckBoxes(prev => {
                                                const prevInput = [...prev];
                                                prevInput[index].isChecked = e.target.checked;
                                                return prevInput;
                                            });

                                        }} />
                                        <input className={styles.rndCheckInput} type="text" value={data.value} onChange={(e) => {
                                            setCheckBoxes(prev => {
                                                const prevInput = [...prev];
                                                prevInput[index].value = e.target.value;
                                                return prevInput;
                                            });
                                        }} />
                                    </Rnd>
                                ))
                            }
                            {
                                radioButtons?.map((data, index) => (
                                    <Rnd
                                        key={`radio_${index}`}
                                        className="overflow-hidden bg-yellow-300 p-2.5"
                                        size={{ width: data.width, height: data.height }}
                                        position={{ x: data.x, y: data.y }}
                                        bounds="parent"
                                        onDragStop={(e, dir) => {
                                            setRadioButtons(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].x = dir.x;
                                                prevInput[index].y = dir.y;

                                                return prevInput;

                                            });
                                        }}
                                        onResizeStop={(_a, _aa, ref, _aaa, _aaaa) => {
                                            setRadioButtons(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].width = ref.style.width;
                                                prevInput[index].height = ref.style.height;

                                                return prevInput;
                                            });
                                        }}
                                    >
                                        <div>
                                            <input onChange={(e) => {
                                                setRadioButtons(prev => {

                                                    const prevInput = [...prev];
                                                    prevInput[index].value = e.target.value;

                                                    return prevInput;
                                                });
                                            }} checked={data.value === "cpp"} name={`coding_${index}`} type="radio" id={`cpp_${index}`} value="cpp" />
                                            <label for={`cpp_${index}`}>C++</label><br />
                                            <input onChange={(e) => {
                                                setRadioButtons(prev => {

                                                    const prevInput = [...prev];
                                                    prevInput[index].value = e.target.value;

                                                    return prevInput;
                                                });
                                            }} checked={data.value === "java"} name={`coding_${index}`} type="radio" id={`java_${index}`} value="java" />
                                            <label for={`java_${index}`}>JAVA</label><br />
                                            <input onChange={(e) => {
                                                setRadioButtons(prev => {

                                                    const prevInput = [...prev];
                                                    prevInput[index].value = e.target.value;

                                                    return prevInput;
                                                });
                                            }} checked={data.value === "python"} name={`coding_${index}`} type="radio" id={`python_${index}`} value="python" />
                                            <label for={`python_${index}`}>PYTHON</label><br />
                                        </div>
                                    </Rnd>
                                ))
                            }
                            {
                                dropdowns?.map((data, index) => (
                                    <Rnd
                                        key={`drop_${index}`}
                                        className="bg-[rgb(4,0,255)] p-5"
                                        size={{ width: data.width, height: data.height }}
                                        position={{ x: data.x, y: data.y }}
                                        bounds="parent"
                                        onDragStop={(e, dir) => {
                                            console.log(e.target.className)
                                            if(String(e.target.className).includes('overflow')){
                                                return;
                                            }
                                            setDropdowns(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].x = dir.x;
                                                prevInput[index].y = dir.y;

                                                return prevInput;

                                            });
                                        }}
                                        onResizeStop={(_a, _aa, ref, _aaa, _aaaa) => {
                                            setDropdowns(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].width = ref.style.width;
                                                prevInput[index].height = ref.style.height;

                                                return prevInput;
                                            });
                                        }}
                                    >
                                        <select className=" overflow-hidden p-2.5 m-auto" value={data.value} onChange={(e) => {
                                            setDropdowns(prev => {

                                                const prevInput = [...prev];
                                                prevInput[index].value = e.target.value;

                                                return prevInput;
                                            });
                                        }}>
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
                        <div className="h-full flex items-center justify-center">
                            <input type="file" accept="application/pdf" onChange={handleFileChange} />
                        </div>
                }

            </div>
        </div>
    );

}