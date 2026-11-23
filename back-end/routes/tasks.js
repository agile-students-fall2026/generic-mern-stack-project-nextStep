import express from 'express';

const router = express.Router();

// GET taskId: for the slides of the one task
// Mock data for sprint 2. Real steps will come from the dtatbase

router.get('/:taskId', (req, res) => {
    const taskId = req.params.taskId;

    const steps = [
        `${taskId} Step 1`,
        `${taskId} Step 2`,
        `${taskId} Step 3`,

    ]
    return res.jason({ taskId: taskId, steps: steps });
});

export default router;