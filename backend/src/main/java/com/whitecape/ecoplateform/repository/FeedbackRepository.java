package com.whitecape.ecoplateform.repository;

import com.whitecape.ecoplateform.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
}
