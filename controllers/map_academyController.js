const Academy = require('../models/map/Academy');
const Review = require('../models/map/Review');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// 학원 이름으로 학원 정보 가져오기
const getAcademyByName = async (req, res) => {
    try {
        const academy = await Academy.findOne({
            where: { academyname: req.params.Academyname },
            include: { model: Review, as: 'reviews' }
        });
        if (!academy) {
            return res.json({ message: 'No academy found', reviews: [] });
        }

        const sortedReviews = academy.reviews ? academy.reviews.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
        res.json({ ...academy.toJSON(), reviews: sortedReviews, userId: req.user.id }); // 유저 ID 포함
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 리뷰 추가하기
const addReview = async (req, res) => {
    const { academyname, rating, comment } = req.body;
    const userId = req.user.id; // req.user에서 userId 추출

    if (!academyname || !rating || !comment) {
        return res.status(400).json({ message: 'All fields (academyname, rating, comment) are required' });
    }

    try {
        let academy = await Academy.findOne({ where: { academyname } });
        if (!academy) {
            academy = await Academy.create({ academyname });
        }

        let review = await Review.findOne({ where: { academyId: academy.id, userId } });
        if (review) {
            review.rating = rating;
            review.comment = comment;
            review.date = new Date();
            await review.save();
        } else {
            await Review.create({
                rating,
                comment,
                userId,
                academyId: academy.id,
            });
        }

        const updatedAcademy = await Academy.findOne({
            where: { academyname },
            include: { model: Review, as: 'reviews' }
        });

        const sortedReviews = updatedAcademy.reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json({ ...updatedAcademy.toJSON(), reviews: sortedReviews });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 별점 평균 계산 및 학원 이름 배열로 조회
const getAcademyRatings = async (req, res) => {
    const { academyNames } = req.body; // 배열로 학원 이름 받기
    if (!Array.isArray(academyNames) || academyNames.length === 0) {
        return res.status(400).json({ message: 'Academy names should be a non-empty array' });
    }

    try {
        const academies = await Academy.findAll({
            where: { academyname: academyNames },
            include: { model: Review, as: 'reviews' }
        });
        if (academies.length === 0) {
            return res.json({ message: 'No academies found' });
        }

        const ratings = academies.map(academy => {
            const reviews = academy.reviews || [];
            const averageRating = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2) : 'No reviews';
            return { academyname: academy.academyname, averageRating };
        });

        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAcademyByName, addReview, getAcademyRatings };
