export const getAvatarImg = (key)=>{
    return AVATARS.find(avatar=>avatar.key==key).image.src;
}
export const AVATARS =  [
    {
      key: "0",
      value: "0",
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg' },
    },
    {
      key: "1",
      value: "1",
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/elliot.jpg' },
    },
    {
      key: "2",
      value: "2",
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/stevie.jpg' },
    },
    {
      key: "3",
      value: "3",
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/christian.jpg' },
    },
    {
      key: "4",
      value: "4",
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/matt.jpg' },
    },
    {
      key: "5",
      value: "5",
      image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/justen.jpg' },
    },
  ]