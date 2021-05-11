import express from 'express'

export const BodyParser = [
    express.json({ limit: "50mb" }),
    express.urlencoded({ extended: true }), //helps creating nested objects from query
]