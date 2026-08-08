const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, '..');
app.use(express.static(publicPath));

app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "smokethyme") {
        return res.json({
            success: true,
            message: "Login successful"
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid credentials"
    });
});

const ordersFile = path.join(__dirname, "orders.json");
const ORDERS_FILE = ordersFile;

// Create orders.json automatically
if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, "[]");
}

// Test backend
app.get("/", (req, res) => {
    res.send("Smoke & Thyme Backend is working!");
});

// Get all orders
app.get("/api/orders", (req, res) => {

    try {

        const orders = JSON.parse(
            fs.readFileSync(ordersFile, "utf8")
        );

        res.json({
            success: true,
            orders: orders
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not read orders"
        });

    }

});

// Receive order
app.post("/api/orders", (req, res) => {

    console.log("ORDER RECEIVED:");
    console.log(req.body);

    try {

        const orders = JSON.parse(
            fs.readFileSync(ordersFile, "utf8")
        );

        const order = {
            id: Date.now(),

            items: req.body.items || [],

            fulfilment: req.body.fulfilment || "pickup",

            time: req.body.time || "",

            phone: req.body.phone || "",

            notes: req.body.notes || "",

            address: req.body.address || "",

            paymentMethod: req.body.paymentMethod || "",

            paymentDetails: req.body.paymentDetails || "",
            estimatedPrepTime: req.body.estimatedPrepTime || "",
            status: "New",
            createdAt: new Date().toLocaleString()
        };

        orders.push(order);

        fs.writeFileSync(
            ordersFile,
            JSON.stringify(orders, null, 2)
        );

        console.log("ORDER SAVED SUCCESSFULLY!");

        res.status(200).json({
            success: true,
            message: "Order saved successfully",
            order: order
        });

    } catch (error) {

        console.error("ERROR SAVING ORDER:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

// Delete order
app.delete("/api/orders/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        let orders = JSON.parse(
            fs.readFileSync(ordersFile, "utf8")
        );

        orders = orders.filter(order => order.id !== id);

        fs.writeFileSync(
            ordersFile,
            JSON.stringify(orders, null, 2)
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update order status
app.post("/api/orders/status", (req, res) => {
    try {
        const { id, status, estimatedPrepTime } = req.body;

        const orders = JSON.parse(
            fs.readFileSync(ordersFile, "utf8")
        );

        const order = orders.find(
            o => String(o.id) === String(id)
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (status) {
            order.status = status;
        }
        if (typeof estimatedPrepTime !== "undefined") {
            order.estimatedPrepTime = estimatedPrepTime;
        }

        fs.writeFileSync(
            ordersFile,
            JSON.stringify(orders, null, 2)
        );

        console.log(`Order ${id} changed to ${status || order.status}`);

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log("");
    console.log("🔥 SMOKE & THYME BACKEND");
    console.log(`Backend running on port ${PORT} on all network interfaces`);
    console.log("");
});