
export const calculateAverageRating = (notes) => {
    if(!notes){
      return 0;
    }
    if (notes.length === 0) {
      return 0;
    }
    const totalNotes = notes.reduce((sum, note) => sum + note.note, 0);
    return totalNotes / notes.length;
  };
