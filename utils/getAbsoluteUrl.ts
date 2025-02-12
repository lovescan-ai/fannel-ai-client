import absoluteUrl from "next-absolute-url";
import { NextApiRequest } from "next";

const getAbsoluteUrl = (req: NextApiRequest) => {
  const { origin } = absoluteUrl(req);

  return origin;
};

export default getAbsoluteUrl;
