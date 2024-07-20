import e, { Router } from "express";
import { checkAuth } from "../checkAuth/checkAuth.js";
import {
  Login,
  SendOTP,
  Signup,
  VerifyOTP,
} from "../user-controller/user-handler.js";
import { GenerateFackData } from "../model-controller/fackitems.js";
import {
  FetchItem,
  SaveSelection,
  UserSelection,
} from "../item-controller/item-handler.js";

const router = Router();

router.get("/", async (req, res) => {
  res.send("server is running!");
});

router.post("/signupsql", Signup);

router.post("/sendOTPsql", SendOTP);

router.post("/loginsql", Login);

router.post("/verifyOTPsql", VerifyOTP);

router.post("/faker", GenerateFackData);

router.get("/getitems", checkAuth, FetchItem);

router.post("/save-selections", checkAuth, SaveSelection);

router.get("/user-selections", checkAuth, UserSelection);

export default router;
