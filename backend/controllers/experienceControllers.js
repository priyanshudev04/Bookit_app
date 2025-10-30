import Experience from "../models/experience.js";
export const createExperience = async (req, res) => {
  try {
    const experience = new Experience(req.body);
    const saved = await experience.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error creating experience", error });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Experience.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting experience", error });
  }
};

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find();

    const formatted = experiences.map(exp => ({
      id: exp._id.toString(),
      title: exp.title,
      description: exp.description,
      shortDescription: exp.shortDescription,
      image: exp.image,
      price: exp.price,
      duration: exp.duration,
      location: exp.location,
      category: exp.category,
      rating: exp.rating,
      reviewCount: exp.reviewCount,
      highlights: exp.highlights,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    res.json({
      id: experience._id.toString(),
      title: experience.title,
      description: experience.description,
      shortDescription: experience.shortDescription,
      image: experience.image,
      price: experience.price,
      duration: experience.duration,
      location: experience.location,
      category: experience.category,
      rating: experience.rating,
      reviewCount: experience.reviewCount,
      highlights: experience.highlights,
    });
  } catch (err) {
    console.error("Error fetching experience:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
