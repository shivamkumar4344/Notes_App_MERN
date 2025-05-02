import moment from "moment";
import {MdOutlinePushPin, MdCreate, MdDelete, MdLabel} from "react-icons/md";

export default function NoteCard({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote,
    viewMode = 'grid'
}) {
    // Determine if we're in grid or list view
    const isGridView = viewMode === 'grid';
    
    return (
        <div className={`border rounded-lg ${isGridView ? 'p-4' : 'p-5'} bg-white hover:shadow-lg transition-all ease-in-out`}>
            <div className="flex items-start justify-between">
                <div className={`${isGridView ? '' : 'flex-1'}`}>
                    <h6 className="text-lg font-medium text-gray-800">{title}</h6>
                    <span className="text-xs text-gray-500">{moment(date).format('Do MMM YYYY')}</span>
                </div>
                <button 
                    onClick={onPinNote}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={isPinned ? "Unpin note" : "Pin note"}
                >
                    <MdOutlinePushPin className={`text-xl ${isPinned ? 'text-primary' : 'text-gray-400'}`} />
                </button>
            </div>
            
            <div className={`${isGridView ? 'mt-3' : 'flex items-start mt-3'}`}>
                <div className={isGridView ? '' : 'flex-1'}>
                    <p className={`text-sm text-gray-600 ${isGridView ? 'line-clamp-3' : 'line-clamp-2'} break-words`}>
                        {content}
                    </p>
                    
                    {tags && tags.length > 0 && (
                        <div className={`flex flex-wrap items-center gap-1 ${isGridView ? 'mt-3' : 'mt-2'}`}>
                            {tags.map((tag, index) => (
                                <span 
                                    key={index} 
                                    className="inline-flex items-center text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full"
                                >
                                    <MdLabel className="mr-1 text-xs" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                
                {!isGridView && (
                    <div className="flex items-center ml-4">
                        <button 
                            onClick={onEdit}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Edit note"
                        >
                            <MdCreate className="text-xl" />
                        </button>
                        <button 
                            onClick={onDelete}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors ml-1"
                            aria-label="Delete note"
                        >
                            <MdDelete className="text-xl" />
                        </button>
                    </div>
                )}
            </div>
            
            {isGridView && (
                <div className="flex items-center justify-end mt-3 pt-3 border-t">
                    <button 
                        onClick={onEdit}
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Edit note"
                    >
                        <MdCreate className="text-lg" />
                    </button>
                    <button 
                        onClick={onDelete}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors ml-1"
                        aria-label="Delete note"
                    >
                        <MdDelete className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
}