import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express from "express";
import mongoose from "mongoose";
import ConnectDB from "../Db/index.js";

ConnectDB();
