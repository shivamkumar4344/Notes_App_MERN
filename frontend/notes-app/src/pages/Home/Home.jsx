import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/Navbar";
import { MdAdd, MdOutlineGridView, MdOutlineViewAgenda, MdSearch, MdOutlineLightbulb } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";

export default function Home() {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add",
    });

    const [allNotes, setAllNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    const navigate = useNavigate();

    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({
            isShown: true,
            data: noteDetails,
            type: "edit"
        });
    };

    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: "",
        });
    };

    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type,
        });
    };

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");

            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    const getAllNotes = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get("/get-all-notes");

            if (response.data && response.data.notes) {
                setAllNotes(response.data.notes);
                setFilteredNotes(response.data.notes);
            }
        } catch (error) {
            showToastMessage("Failed to load notes", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNote = async (data) => {
        const noteId = data._id;
        try {
            const response = await axiosInstance.delete("/delete-note/" + noteId);

            if (response.data && !response.data.error) {
                showToastMessage("Note deleted successfully", 'delete');
                getAllNotes();
            }
        } catch (error) {
            showToastMessage("Failed to delete note", "error");
        }
    };
    
    const updateNotePinned = async (note) => {
        try {
            await axiosInstance.put(`/update-note-pinned/${note._id}`, {
                isPinned: !note.isPinned
            });
            getAllNotes();
            showToastMessage(`Note ${note.isPinned ? 'unpinned' : 'pinned'} successfully`, 'success');
        } catch (error) {
            showToastMessage("Failed to update pin status", "error");
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredNotes(allNotes);
            return;
        }
        
        const filtered = allNotes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) || 
            note.content.toLowerCase().includes(query.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        setFilteredNotes(filtered);
    };
    
    const filterByTag = (tag) => {
        setSelectedTag(tag === selectedTag ? null : tag);
    };
    
    // Extract all unique tags from notes
    const getAllTags = () => {
        const tags = new Set();
        allNotes.forEach(note => {
            note.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    };

    useEffect(() => {
        getAllNotes();
        getUserInfo();
        return () => {};
    }, []);
    
    useEffect(() => {
        if (selectedTag) {
            const filtered = allNotes.filter(note => 
                note.tags.includes(selectedTag)
            );
            setFilteredNotes(filtered);
        } else if (searchQuery) {
            handleSearch(searchQuery);
        } else {
            setFilteredNotes(allNotes);
        }
    }, [selectedTag, allNotes, searchQuery]);

    // Separate pinned and unpinned notes
    const pinnedNotes = filteredNotes.filter(note => note.isPinned);
    const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userInfo={userInfo} />
            
            <div className="container mx-auto px-4 py-6">
                {/* Search and view controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
                        <input 
                            type="text" 
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <MdSearch className="absolute left-3 top-2.5 text-gray-500 text-xl" />
                    </div>
                    <div className="flex items-center">
                        <button 
                            className={`p-2 mx-1 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <MdOutlineGridView className="text-xl" />
                        </button>
                        <button 
                            className={`p-2 mx-1 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <MdOutlineViewAgenda className="text-xl" />
                        </button>
                    </div>
                </div>
                
                {/* Tags */}
                {getAllTags().length > 0 && (
                    <div className="mb-6 flex flex-wrap">
                        {getAllTags().map(tag => (
                            <button 
                                key={tag}
                                className={`mr-2 mb-2 px-3 py-1 text-sm rounded-full transition ${selectedTag === tag ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                onClick={() => filterByTag(tag)}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {filteredNotes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <MdOutlineLightbulb className="text-6xl text-gray-400 mb-4" />
                                <h2 className="text-2xl font-medium text-gray-600 mb-2">No notes found</h2>
                                <p className="text-gray-500">
                                    {searchQuery || selectedTag ? 
                                        "Try changing your search or filter" : 
                                        "Create your first note by clicking the + button"}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Pinned Notes Section */}
                                {pinnedNotes.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-lg font-medium text-gray-700 mb-4">Pinned</h2>
                                        <div className={viewMode === 'grid' ? 
                                            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
                                            "flex flex-col space-y-4"
                                        }>
                                            {pinnedNotes.map((item) => (
                                                <NoteCard
                                                    key={item._id}
                                                    title={item.title}
                                                    date={item.createdOn}
                                                    content={item.content}
                                                    tags={item.tags}
                                                    isPinned={item.isPinned}
                                                    onEdit={() => handleEdit(item)}
                                                    onDelete={() => deleteNote(item)}
                                                    onPinNote={() => updateNotePinned(item)}
                                                    viewMode={viewMode}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Other Notes Section */}
                                {unpinnedNotes.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-700 mb-4">Notes</h2>
                                        <div className={viewMode === 'grid' ? 
                                            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
                                            "flex flex-col space-y-4"
                                        }>
                                            {unpinnedNotes.map((item) => (
                                                <NoteCard
                                                    key={item._id}
                                                    title={item.title}
                                                    date={item.createdOn}
                                                    content={item.content}
                                                    tags={item.tags}
                                                    isPinned={item.isPinned}
                                                    onEdit={() => handleEdit(item)}
                                                    onDelete={() => deleteNote(item)}
                                                    onPinNote={() => updateNotePinned(item)}
                                                    viewMode={viewMode}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Add Note Button */}
            <button 
                className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-blue-600 shadow-lg fixed right-8 bottom-8 transition-transform transform hover:scale-110"
                onClick={() => {
                    setOpenAddEditModal({
                        isShown: true,
                        type: "add",
                        data: null,
                    })
                }}
            >
                <MdAdd className="text-[32px] text-white" />
            </button>

            {/* Add/Edit Note Modal */}
            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => {
                    setOpenAddEditModal({
                        isShown: false,
                        type: "add",
                        data: null
                    });
                }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                }}
                contentLabel=""
                className="w-full max-w-2xl max-h-3/4 bg-white rounded-lg mx-auto mt-14 p-6 shadow-xl overflow-auto"
                ariaHideApp={false}
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => {
                        setOpenAddEditModal({
                            isShown: false,
                            type: "add",
                            data: null
                        });
                    }}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                />
            </Modal>

            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </div>
    );
}