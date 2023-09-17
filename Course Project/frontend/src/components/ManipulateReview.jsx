import React, { useEffect, useState } from "react";
import Autocomplete , { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import { Delete } from "@mui/icons-material";
import { styled } from "@mui/system";
import { FileUploader } from "react-drag-drop-files";
import { useLocation, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { MenuItem , Select} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import { getPieces } from "../services/pieceService";
import { getTags } from "../services/tagsService";
import { getReviewById } from "../services/reviewsService";
import { createReview } from "../services/reviewsService";
import { editReview } from "../services/reviewsService";
import { calculateAverageRating } from '../services/calculateAvgRating';

const fileTypes = ["JPG", "PNG", "GIF"];


const DeleteIcon = styled(Delete)({
  cursor: "pointer",
});


const parseTags = (tags) => {
  const parsed_tags = []
  tags.map((tag)=>{
    parsed_tags.push(tag.value)
  })
  return parsed_tags
}



const ManipulateReview = ({mode, setAlertMessage, setOpen, setReviews, adminMode, reviews}) => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [piece, setPiece] = useState("");
  const [group, setGroup] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [authorRating, setAuthorRating] = useState(0);
  const [pieces, setPieces] = useState([])
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  const navigate = useNavigate()
  const [userId, setUserId] = useState(null)
  const { t } = useTranslation()

  const groups =['game','book','tech','cinema','sport','other']

  const filter = createFilterOptions()

useEffect(()=>{
  getPieces()
  .then(result => setPieces(result))

},[])


useEffect(()=>{
  getTags()
  .then(result => setTags(parseTags(result)))

},[])

  useEffect(() => {
    if(mode === 'edit'){
    getReviewById(path)
      .then(res => {
          setTitle(res.name)
          setPiece(res.piece.name)
          setGroup(res.group)
          setReviewText(res.text)
          setAuthorRating(res.author_note)
          setSelectedTags(parseTags(res.tags))
      })
      .catch(error => {
        console.error(error);
      });
    }
    else{
      setUserId(path)
    }
  }, []);

  const handleAutocompleteChange = (event, newValue) => {
    if (newValue) {
      setSelectedTags([...selectedTags, newValue]);
    }
  };

  const handleChange = (file) => {
    setFile(file);
  };

  const handlePiece = (event, newValue) =>{
    if (typeof newValue === 'string') {
      setPiece({
        name: newValue,
        notes: []
      });
    } else if (newValue && newValue.inputValue) {
      setPiece({
        name: newValue.inputValue,
        notes: []
      });
    } else {
      setPiece(newValue);
    }
  }

const filter_options = (options, params) => {
  const filtered = filter(options, params);

  const { inputValue } = params;
  const isExisting = options.some((option) => inputValue === option.name);
  if (inputValue !== '' && !isExisting) {
    filtered.push({
      inputValue,
      title: `Add "${inputValue}"`,
    });
  }

  return filtered;
}

  const handleGroupChange = (e) =>{
    setGroup(e.target.value)
  }

  const handleSubmit = async () => {
    const new_piece = typeof piece === 'object' ? piece.name : piece;
    const formData = new FormData();
    formData.append("name", title);
    formData.append("piece", new_piece);
    formData.append("group", group);
    formData.append("tags", JSON.stringify(selectedTags));
    formData.append("text", reviewText);
    formData.append("author_note", authorRating);
    formData.append("file", file);
    formData.append("userId", userId)

    try {
      if(mode === 'create'){
      const review = await createReview(formData)
      setReviews(prevReviews => [...prevReviews, review]);
      setAlertMessage(t('create_review'))
      setOpen(true)
      window.scrollTo(0, 0);
      navigate('/')

    }else{
      window.scrollTo(0, 0);
      const updatedReview = await editReview(path, formData)
      setReviews(reviews.map((review)=>{
        return review._id === updatedReview._id ? updatedReview : review
      }))
      navigate('/')
      setAlertMessage(t('edit_review'))
      setOpen(true)

    }
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };


  return (
    <div style={{ width: "50%", margin: "auto" }}>

    {adminMode && (
        <Paper elevation={3} style={{ background: "red", color: "white", padding: "1rem", marginBottom: "1rem" }}>
          <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
            {t('admin notion')}
          </Typography>
        </Paper>
      )}
      <TextField
        label={t('review name')}
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Autocomplete
        options={pieces}
        onChange={handlePiece}
        value={piece}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        freeSolo={true}
        filterOptions={filter_options}
        clearOnBlur={true}
        renderInput={(params) => <TextField {...params} label={t('piece')} />}
        renderOption={(props, option) => (
          <Box component="li"  {...props}>
            <Typography sx={{paddingRight: 1}} >{option.name}</Typography>
            <StarIcon fontSize="small" color="primary" />
            {calculateAverageRating(option.notes)}
          </Box>
        )}


      />
    <Box sx={{ minWidth: 120}}>

     <InputLabel id="group_label">{t('group')}</InputLabel>
      <Select
      labelId="group_label"
      id="group"
      value={group}
      onChange={handleGroupChange}
      label={t('group')}
      sx={{ width: '100%',}}
      >
      {groups.map((group)=><MenuItem value={t(group)}> {t(group)} </MenuItem>)}
    </Select>
    </Box>

      <Autocomplete
        options={tags}
        onChange={handleAutocompleteChange}
        freeSolo={true}
        clearOnBlur={true}
        renderInput={(params) => <TextField {...params} label={t('tags')} />}
      />

      <div style={{ marginTop: "0.5rem" }}>
        {selectedTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => {
              setSelectedTags(selectedTags.filter((t) => t !== tag));
            }}
            style={{ marginRight: "5px" }}
          />
        ))}
      </div>

      <TextareaAutosize
        minRows={5}
        maxRows={10}
        placeholder={t('review text')}
        style={{ width: "100%", marginTop: "1rem" }}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <div style={{ marginTop: "1rem" }}>
        <p>{t('my rating')}</p>
        <Rating
          name="author-rating"
          value={authorRating}
          max={10}
          onChange={(event, newValue) => setAuthorRating(newValue)}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <p>{t('img text')}</p>
        <FileUploader handleChange={handleChange} name="file" types={fileTypes}>
          {file && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded"
                style={{ maxWidth: "800px", maxHeight: "600px", marginRight: "1rem" }}
              />
              <DeleteIcon
                color="secondary"
                fontSize="large"
                onClick={() => setFile(null)}
              />
            </div>
          )}
        </FileUploader>
      </div>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "1rem" }}
        onClick={handleSubmit}
      >
        {mode}
      </Button>
    </div>
  );
};

export default ManipulateReview;
