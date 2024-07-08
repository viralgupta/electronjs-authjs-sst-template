import { Request, Response } from "express";

const createItem = async (req: Request, res: Response) => {}
const getAllItems = async (req: Request, res: Response) => {}
const getItem = async (req: Request, res: Response) => {}
const editItem = async (req: Request, res: Response) => {}
const editQuantity = async (req: Request, res: Response) => {}
const deleteItem = async (req: Request, res: Response) => {}

export {
  createItem,
  getAllItems,
  getItem,
  editItem,
  editQuantity,
  deleteItem
}