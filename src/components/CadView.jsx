
import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { baseLink, blockApi, filesApi } from "../assets/api";


const CadView = ({ fileUploaded, clearUploadFlag }) => {
  const [fileData, setFileData] = useState([]);
  const [blockMap, setBlockMap] = useState({});
  const [blockDataMap, setBlockDataMap] = useState({});
  const [searchMap, setSearchMap] = useState({});
  const [pageMap, setPageMap] = useState({});
  const [totalPagesMap, setTotalPagesMap] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const limit = 10;

  const handleBlock = async (fileId) => {
    const currentPage = pageMap[fileId] || 1;
    const currentSearch = searchMap[fileId] || "";

    try {
      const res = await axios.get(`${baseLink}/${blockApi.getAllBlocksName}${fileId}`, {
        params: { page: currentPage, limit, name: currentSearch },
      });

      const { blocksData, totalPages } = res.data;
      setBlockMap((prev) => ({ ...prev, [fileId]: blocksData }));
      setTotalPagesMap((prev) => ({ ...prev, [fileId]: totalPages }));
    } catch (error) {
      console.error("Error fetching block data:", error);
    }
  };

  const handleBlockData = async (blockId) => {
    try {
      const resblock = await axios.get(`${baseLink}/${blockApi.getBlockById}${blockId}`);
      const data = resblock?.data?.data;
      setBlockDataMap((prev) => ({ ...prev, [blockId]: data }));
    } catch (error) {
      console.error("Error fetching block data:", error);
    }
  };

  const searchHandler = async (e, fileId) => {
    const query = e.target.value;
    setSearchMap((prev) => ({ ...prev, [fileId]: query }));
    setPageMap((prev) => ({ ...prev, [fileId]: 1 }));

    try {
      const res = await axios.get(`${baseLink}/${blockApi.getAllBlocksName}${fileId}`, {
        params: { page: 1, limit, name: query },
      });

      const { blocksData, totalPages } = res.data;
      setBlockMap((prev) => ({ ...prev, [fileId]: blocksData }));
      setTotalPagesMap((prev) => ({ ...prev, [fileId]: totalPages }));
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handlePageChange = (fileId, direction) => {
    const currentPage = pageMap[fileId] || 1;
    const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;

    if (newPage < 1 || newPage > (totalPagesMap[fileId] || 1)) return;
    setPageMap((prev) => ({ ...prev, [fileId]: newPage }));
  };

  useEffect(() => {
    Object.keys(pageMap).forEach((fileId) => {
      handleBlock(fileId);
    });
  }, [pageMap]);

  const fetchFileData = async () => {
    try {
      const allFiles = await axios.get(`${baseLink}/${filesApi.fetchAllFile}`);
      setFileData(allFiles?.data?.allFilesData);
    } catch (error) {
      console.error("Error fetching file data:", error);
    }
  };

  useEffect(() => {
    fetchFileData();
  }, []);

  useEffect(() => {
    if (fileUploaded) {
      fetchFileData();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        clearUploadFlag();
      }, 3000);
    }
  }, [fileUploaded]);

  return (
    <div className="mx-auto my-4 maxWidth">
      {showSuccess && (
        <div className="alert alert-success text-center" role="alert">
          File uploaded successfully!
        </div>
      )}

      <Accordion className="my-3">
        {fileData?.map((file, index) => (
          <Accordion.Item
            eventKey={index.toString()}
            key={file.id}
            onClick={() => handleBlock(file.id)}
          >
            <Accordion.Header>{file.filename}</Accordion.Header>
            <Accordion.Body>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search block by name..."
                value={searchMap[file.id] || ""}
                onChange={(e) => searchHandler(e, file.id)}
              />

              {!(blockMap[file.id]?.length) ? (
                <p>No block data available for this file.</p>
              ) : (
                <>
                  <Accordion className="my-3">
                    {blockMap[file.id].map((block, i) => (
                      <Accordion.Item
                        eventKey={`block-${i}`}
                        key={block.id || i}
                        onClick={() => handleBlockData(block.id)}
                      >
                        <Accordion.Header>{block.name || `Block ${i + 1}`}</Accordion.Header>
                        <Accordion.Body>
                          <Table striped bordered hover size="sm">
                            <thead>
                              <tr>
                                <th>Block Name</th>
                                <th>Type</th>
                                <th colSpan="3">Position</th>
                                <th colSpan="3">Point1</th>
                                <th colSpan="3">Point2</th>
                                <th>Layer</th>
                                <th>Handle</th>
                                <th>Text</th>
                                <th>Angle</th>
                              </tr>
                              <tr>
                                <th></th><th></th>
                                <th>X</th><th>Y</th><th>Z</th>
                                <th>X</th><th>Y</th><th>Z</th>
                                <th>X</th><th>Y</th><th>Z</th>
                                <th></th><th></th><th></th><th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{blockDataMap[block.id]?.name || "-"}</td>
                                <td>{blockDataMap[block.id]?.type}</td>
                                <td>{blockDataMap[block.id]?.x || 0}</td>
                                <td>{blockDataMap[block.id]?.y || 0}</td>
                                <td>{blockDataMap[block.id]?.z || 0}</td>
                                <td>{blockDataMap[block.id]?.xPoint1 || 0}</td>
                                <td>{blockDataMap[block.id]?.yPoint1 || 0}</td>
                                <td>{blockDataMap[block.id]?.zPoint1 || 0}</td>
                                <td>{blockDataMap[block.id]?.xPoint2 || 0}</td>
                                <td>{blockDataMap[block.id]?.yPoint2 || 0}</td>
                                <td>{blockDataMap[block.id]?.zPoint2 || 0}</td>
                                <td>{blockDataMap[block.id]?.layer || "-"}</td>
                                <td>{blockDataMap[block.id]?.handle || "-"}</td>
                                <td>{blockDataMap[block.id]?.text || "-"}</td>
                                <td>{blockDataMap[block.id]?.angle || 0}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>

                  <div className="pagination-controls">
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePageChange(file.id, "prev")}
                      disabled={(pageMap[file.id] || 1) === 1}
                    >
                      Prev
                    </button>
                    <span>
                      &nbsp; Page {pageMap[file.id] || 1} of {totalPagesMap[file.id] || 1} &nbsp;
                    </span>
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePageChange(file.id, "next")}
                      disabled={(pageMap[file.id] || 1) === (totalPagesMap[file.id] || 1)}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default CadView;
