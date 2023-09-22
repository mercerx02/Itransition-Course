import React, { useEffect, useState } from 'react'
import { Box,Typography} from '@mui/material';
import { TagCloud } from 'react-tagcloud';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { getTags } from '../services/tagsService';

const TagCloudComponent = () => {
  const [tags, setTags] = useState([])
  const { t } = useTranslation();

  const customRenderer = (tag, size, color) => {

    const tagStyles = {
      fontSize: `${size}px`,
      color,
      display: 'inline-block',
      margin: '0.2rem',
      padding: '0.1rem',
      borderRadius: '4px',
    };

    return (
      <Link to={`/reviews/tags/${tag.value}`} style={{ textDecoration: 'none' }}>
        <Typography
          key={tag.value}
          variant="body2"
          style={tagStyles}
        >
          {tag.value}
        </Typography>
      </Link>
    );
  };


  useEffect(()=>{
    getTags()
    .then( result => setTags(result))

  },[])
  return (
    <>
    <Box sx={{ paddingTop: 10 }} justifyContent='center' flexGrow={1} ml={2}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="h4" mb={2}>
            {t('trends')}
            </Typography>
            </Box>
            <TagCloud
            tags={tags}
            shuffle={true}
            minSize={20}
            maxSize={30}
            renderer={customRenderer}

            />
    </Box>
    </>
  )
}

export default TagCloudComponent
