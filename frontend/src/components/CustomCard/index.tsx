import { styled } from '@mui/material';
import Card from '@mui/material/Card';

const CustomCard = styled(Card)(({ theme, onClick }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.shape.borderRadius * 4,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flex: 1,
    ...(typeof onClick === 'function'
        ? {
              '&:hover': {
                  backgroundColor: theme.palette.action.hover,
              },
              '&:active': {
                  backgroundColor: theme.palette.action.selected,
              },
              transition: theme.transitions.create(['background-color'], {
                  duration: theme.transitions.duration.short,
              }),
              cursor: 'pointer',
          }
        : {}),
}));

export default CustomCard;
