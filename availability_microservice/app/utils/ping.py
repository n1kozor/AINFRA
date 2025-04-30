# app/utils/ping.py
from ping3 import ping as ping3_ping
import asyncio
import concurrent.futures

# Thread pool for background ping tasks
thread_pool_executor = concurrent.futures.ThreadPoolExecutor(max_workers=8)

def check_host_availability(ip_address, timeout=1):
    """
    Check if host is available using ping3 package with strict validation.
    Returns (is_available, response_time_ms)
    """
    try:
        print(f"Starting ping3 check for: {ip_address}")
        # Returns None on timeout/failure, or response time in seconds on success
        response_time = ping3_ping(ip_address, timeout=timeout, unit='s')

        # Only accept if response time is not None and greater than 0
        if response_time is not None and response_time > 0:
            print(f"Ping3 valid success for {ip_address}: {response_time * 1000:.2f}ms")
            return True, response_time * 1000  # Convert to ms

        # Zero response times are suspicious, reject them
        if response_time == 0:
            print(f"Ping3 suspicious zero time for {ip_address} - rejecting")
            return False, None

        print(f"Ping3 failed for {ip_address}")
        return False, None
    except Exception as e:
        print(f"Ping3 error for {ip_address}: {str(e)}")
        return False, None

async def ping_device_async(ip_address):
    """Execute ping using ping3 package in a non-blocking way"""
    loop = asyncio.get_running_loop()

    # Run ping in a thread to avoid blocking the event loop
    return await loop.run_in_executor(
        thread_pool_executor,
        check_host_availability,
        ip_address
    )