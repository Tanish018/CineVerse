package com.tanish.moviebooking.redis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisSeatLockService {

    private final static Duration LOCK_DURATION = Duration.ofMinutes(10);

    private final StringRedisTemplate redisTemplate;

    public boolean lockSeat(Long showId, Long seatId, Long bookingId) {
        String key = "show:" + showId + ":seat:" + seatId;
        Boolean locked = redisTemplate.opsForValue().setIfAbsent(key, bookingId.toString(), LOCK_DURATION);
        return Boolean.TRUE.equals(locked);
    }

    public boolean isSeatLocked(Long showId, Long seatId) {
        String key = "show:" + showId + ":seat:" + seatId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public void unlockSeat(Long showId, Long seatId) {
        String key = "show:" + showId + ":seat:" + seatId;
        redisTemplate.delete(key);
    }

}