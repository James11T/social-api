import * as yup from "yup";

const pingSchema = yup.object().shape({
  message: yup.string().required()
});

type pingSchemaType = yup.InferType<typeof pingSchema>;

export { pingSchema };
export type { pingSchemaType };
