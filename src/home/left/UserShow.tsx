import React from "react";
import { Button, Avatar, Typography, Box ,makeStyles} from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyle = makeStyles({
  ava:{
    margin:"0 auto",
    height:"200px",
    width:"200px",
    display:"block"
  }

})

export function UserShow({ avatarUrl, userName, logout }: { avatarUrl: string; userName: string; logout: () => void; }) {
  const style = useStyle();
  return (
    <>
      <Avatar src={avatarUrl} variant="square" className={style.ava}/>
      <Typography align="center" variant="h6">{userName}</Typography>
      <Button onClick={logout} variant="outlined" startIcon={<ExitToAppIcon />}>
        Logout
      </Button>
      <Box mb="10px"></Box>
    </>
  );
}
