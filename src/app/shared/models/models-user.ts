export interface IUSER {
  email: string;
  name: string;
  nickName: string;
  image: { available: boolean; image: string };
  role: string;
  favorites: Array<{ name: string; link: string }>;
  timeStamp: number;
  uid: string;
  city?:string;
  country?:string;
}



  export interface IUSER_POST_BLOG {
    type: 'post' | 'blog' | 'profile',
    timeStamp: number;
    updateTimeStamp:number,
    status: 'draft' | 'deleted' | 'archived' | 'published'
    uid:string;
    id:string;
    likes:number;
    payload: {
      title:string;
      description:string;
      content?:string;
      keywords?:string;
      link?:string
      image:{ available: boolean, image:string}
      tags: Array<string>,
      category: { available: boolean,  meta:string}
      // writer_name: string,
      // writer_image: { available: boolean, image:string}
      // city:string;
      // country:string;
      // relevance:number,
      aggregateRating?: {
        nr:number,
        value:number
      },

    }
  }








