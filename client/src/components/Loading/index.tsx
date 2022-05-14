import { Box, CircularProgress, Modal } from "@mui/material";

interface PropType { open: boolean; };

const Loading = ({ open }: PropType): JSX.Element => {
    return (
        <Modal open={open} sx={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Box bgcolor="background.paper" sx={{ top: '50%', padding: 2, border: 1 }}>
            <CircularProgress />
            </Box>
        </Modal>
    );
};

export default Loading;