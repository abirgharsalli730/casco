import * as Yup from "yup";

/*==== createProjectSchema =====*/
export const projectSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    description: Yup.string()
      .min(10, 'Too Short!')
      .max(500, 'Too Long!')
      .required('Required'),
  });
  
  /*==== createProjectSchema =====*/
  

  
