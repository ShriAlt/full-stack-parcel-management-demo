package com.tcs.parcelX.service;
import com.tcs.parcelX.dto.FeedbackRequest;
import com.tcs.parcelX.entity.Feedback;
import com.tcs.parcelX.entity.Parcel;
import com.tcs.parcelX.entity.User;
import com.tcs.parcelX.exception.ParcelNotFoundException;
import com.tcs.parcelX.exception.UnauthorizedException;
import com.tcs.parcelX.exception.UserNotFoundException;
import com.tcs.parcelX.repository.FeedbackRepository;
import com.tcs.parcelX.repository.ParcelRepository;
import com.tcs.parcelX.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private ParcelRepository parcelRepository;
    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> submitFeedback(FeedbackRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Parcel parcel = parcelRepository.findById(request.getParcelId())
                .orElseThrow(() -> new ParcelNotFoundException("Parcel not found"));

        if (!parcel.getSender().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized");
        }

        Feedback feedback = Feedback.builder()
                .parcel(parcel)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        return toFeedbackResponse(feedbackRepository.save(feedback));
    }

    public List<Map<String, Object>> getFeedbackForParcel(Long parcelId) {
        return feedbackRepository.findByParcelId(parcelId)
                .stream()
                .map(this::toFeedbackResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllFeedback() {
        return feedbackRepository.findAll()
                .stream()
                .map(this::toFeedbackResponse)
                .collect(Collectors.toList());
    }

    private Map<String, Object> toFeedbackResponse(Feedback feedback) {
        return Map.<String, Object>of(
                "id", feedback.getId(),
                "parcelId", feedback.getParcel().getId(),
                "trackingId", feedback.getParcel().getTrackingId(),
                "username", feedback.getUser().getUsername(),
                "userName", feedback.getUser().getName() == null ? "" : feedback.getUser().getName(),
                "rating", feedback.getRating(),
                "comment", feedback.getComment() == null ? "" : feedback.getComment(),
                "createdAt", feedback.getCreatedAt()
        );
    }
}

