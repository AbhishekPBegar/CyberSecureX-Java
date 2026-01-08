package com.cybersecurex.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;

@Service
public class NetworkScannerService {

    private final ExecutorService executor = Executors.newFixedThreadPool(50);

    public Map<String, Object> scanLocalNetwork() {
        Map<String, Object> result = new HashMap<>();

        try {
            // Get local network info
            Map<String, String> networkInfo = getNetworkInfo();
            result.put("networkInfo", networkInfo);

            String subnet = networkInfo.get("subnet");
            if (subnet == null) {
                result.put("status", "error");
                result.put("message", "Could not determine local network subnet");
                return result;
            }

            // Scan for active devices
            List<Map<String, Object>> devices = scanForDevices(subnet);
            result.put("devices", devices);
            result.put("deviceCount", devices.size());
            result.put("timestamp", new Date().toString());
            result.put("status", "success");
            result.put("message", "Network scan completed successfully!");

        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "Error scanning network: " + e.getMessage());
        }

        return result;
    }

    private Map<String, String> getNetworkInfo() throws SocketException {
        Map<String, String> info = new HashMap<>();

        Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
        while (interfaces.hasMoreElements()) {
            NetworkInterface networkInterface = interfaces.nextElement();

            if (!networkInterface.isLoopback() && networkInterface.isUp() && !networkInterface.isVirtual()) {
                for (InterfaceAddress address : networkInterface.getInterfaceAddresses()) {
                    InetAddress inetAddress = address.getAddress();

                    if (inetAddress instanceof Inet4Address && !inetAddress.isLoopbackAddress()) {
                        String ip = inetAddress.getHostAddress();
                        String networkName = networkInterface.getDisplayName();

                        // Calculate subnet
                        String subnet = calculateSubnet(ip, address.getNetworkPrefixLength());

                        info.put("localIP", ip);
                        info.put("networkInterface", networkName);
                        info.put("subnet", subnet);
                        info.put("subnetMask", getSubnetMask(address.getNetworkPrefixLength()));

                        return info; // Return first valid network
                    }
                }
            }
        }

        // Fallback
        info.put("subnet", "192.168.1");
        return info;
    }

    private String calculateSubnet(String ip, short prefixLength) {
        String[] parts = ip.split("\\.");
        if (prefixLength >= 24) {
            return parts[0] + "." + parts[1] + "." + parts[2];
        } else if (prefixLength >= 16) {
            return parts[0] + "." + parts[1];
        } else {
            return parts[0];
        }
    }

    private String getSubnetMask(short prefixLength) {
        int mask = 0xffffffff << (32 - prefixLength);
        return String.format("%d.%d.%d.%d",
                (mask >> 24) & 0xff, (mask >> 16) & 0xff,
                (mask >> 8) & 0xff, mask & 0xff);
    }

    private List<Map<String, Object>> scanForDevices(String subnet) {
        List<Map<String, Object>> devices = new ArrayList<>();
        List<Future<Map<String, Object>>> futures = new ArrayList<>();

        // Scan IP range (1-254)
        for (int i = 1; i <= 254; i++) {
            String ip = subnet + "." + i;
            futures.add(executor.submit(() -> scanSingleDevice(ip)));
        }

        // Collect results with timeout
        for (Future<Map<String, Object>> future : futures) {
            try {
                Map<String, Object> device = future.get(2, TimeUnit.SECONDS);
                if (device != null && (Boolean) device.get("reachable")) {
                    devices.add(device);
                }
            } catch (Exception e) {
                // Skip failed scans
            }
        }

        return devices;
    }

    private Map<String, Object> scanSingleDevice(String ip) {
        Map<String, Object> device = new HashMap<>();

        try {
            InetAddress address = InetAddress.getByName(ip);
            boolean reachable = address.isReachable(1500); // 1.5 second timeout

            device.put("ip", ip);
            device.put("reachable", reachable);

            if (reachable) {
                // Get hostname
                String hostname = getHostname(address);
                device.put("hostname", hostname);

                // Get MAC address (best effort)
                String macAddress = getMacAddress(ip);
                device.put("macAddress", macAddress);

                // Scan common ports
                List<Map<String, Object>> openPorts = scanDevicePorts(ip);
                device.put("openPorts", openPorts);
                device.put("portCount", openPorts.size());

                // Guess device type based on ports and hostname
                String deviceType = guessDeviceType(hostname, openPorts);
                device.put("deviceType", deviceType);

                // Security assessment
                List<String> securityNotes = assessDeviceSecurity(openPorts);
                device.put("securityNotes", securityNotes);
            }

        } catch (Exception e) {
            device.put("reachable", false);
            device.put("error", e.getMessage());
        }

        return device;
    }

    private String getHostname(InetAddress address) {
        try {
            String hostname = address.getHostName();
            if (!hostname.equals(address.getHostAddress())) {
                return hostname;
            }
        } catch (Exception e) {
            // Fallback to reverse DNS
        }
        return "Unknown";
    }

    private String getMacAddress(String ip) {
        try {
            // This is a simplified approach - MAC addresses are typically only
            // available for devices on the same network segment
            InetAddress address = InetAddress.getByName(ip);
            NetworkInterface ni = NetworkInterface.getByInetAddress(address);
            if (ni != null) {
                byte[] mac = ni.getHardwareAddress();
                if (mac != null) {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < mac.length; i++) {
                        sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? ":" : ""));
                    }
                    return sb.toString();
                }
            }
        } catch (Exception e) {
            // MAC address not available
        }
        return "Unknown";
    }

    private List<Map<String, Object>> scanDevicePorts(String ip) {
        List<Map<String, Object>> openPorts = new ArrayList<>();
        int[] commonPorts = { 21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 443, 445, 993, 995, 1723, 3389, 5900, 8080,
                8443, 9100 };

        for (int port : commonPorts) {
            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress(ip, port), 800); // 800ms timeout

                Map<String, Object> portInfo = new HashMap<>();
                portInfo.put("port", port);
                portInfo.put("service", getServiceName(port));
                portInfo.put("description", getServiceDescription(port));
                portInfo.put("riskLevel", getPortRiskLevel(port));

                openPorts.add(portInfo);
            } catch (IOException ignored) {
                // Port closed or filtered
            }
        }

        return openPorts;
    }

    private String getServiceName(int port) {
        Map<Integer, String> services = new HashMap<>();
        services.put(21, "FTP");
        services.put(22, "SSH");
        services.put(23, "Telnet");
        services.put(25, "SMTP");
        services.put(53, "DNS");
        services.put(80, "HTTP");
        services.put(110, "POP3");
        services.put(135, "RPC");
        services.put(139, "NetBIOS");
        services.put(143, "IMAP");
        services.put(443, "HTTPS");
        services.put(445, "SMB");
        services.put(993, "IMAPS");
        services.put(995, "POP3S");
        services.put(1723, "PPTP");
        services.put(3389, "RDP");
        services.put(5900, "VNC");
        services.put(8080, "HTTP-Alt");
        services.put(8443, "HTTPS-Alt");
        services.put(9100, "Printer");

        return services.getOrDefault(port, "Unknown");
    }

    private String getServiceDescription(int port) {
        Map<Integer, String> descriptions = new HashMap<>();
        descriptions.put(21, "File Transfer Protocol");
        descriptions.put(22, "Secure Shell");
        descriptions.put(23, "Telnet (Unencrypted)");
        descriptions.put(25, "Email Server");
        descriptions.put(53, "Domain Name System");
        descriptions.put(80, "Web Server");
        descriptions.put(110, "Email Retrieval");
        descriptions.put(135, "Windows RPC");
        descriptions.put(139, "Windows File Sharing");
        descriptions.put(143, "Email Server");
        descriptions.put(443, "Secure Web Server");
        descriptions.put(445, "Windows File Sharing");
        descriptions.put(993, "Secure Email");
        descriptions.put(995, "Secure Email");
        descriptions.put(1723, "VPN Server");
        descriptions.put(3389, "Remote Desktop");
        descriptions.put(5900, "Remote Desktop");
        descriptions.put(8080, "Web Server");
        descriptions.put(8443, "Secure Web Server");
        descriptions.put(9100, "Network Printer");

        return descriptions.getOrDefault(port, "Unknown Service");
    }

    private String getPortRiskLevel(int port) {
        // High risk ports
        if (port == 23 || port == 21 || port == 135 || port == 139 || port == 445) {
            return "HIGH";
        }
        // Medium risk ports
        if (port == 22 || port == 3389 || port == 5900 || port == 1723) {
            return "MEDIUM";
        }
        // Low risk ports
        return "LOW";
    }

    private String guessDeviceType(String hostname, List<Map<String, Object>> openPorts) {
        String lower = hostname.toLowerCase();

        // Check hostname patterns
        if (lower.contains("router") || lower.contains("gateway"))
            return "Router/Gateway";
        if (lower.contains("printer") || lower.contains("hp") || lower.contains("canon"))
            return "Printer";
        if (lower.contains("nas") || lower.contains("synology") || lower.contains("qnap"))
            return "Network Storage";
        if (lower.contains("camera") || lower.contains("ipcam"))
            return "Security Camera";
        if (lower.contains("phone") || lower.contains("voip"))
            return "IP Phone";

        // Check by open ports
        Set<Integer> ports = new HashSet<>();
        for (Map<String, Object> portInfo : openPorts) {
            ports.add((Integer) portInfo.get("port"));
        }

        if (ports.contains(9100))
            return "Network Printer";
        if (ports.contains(3389))
            return "Windows Computer";
        if (ports.contains(22) && ports.contains(80))
            return "Linux Server";
        if (ports.contains(80) && ports.contains(443))
            return "Web Server";
        if (ports.contains(445) || ports.contains(139))
            return "Windows Computer";
        if (ports.contains(5900))
            return "Computer (VNC)";

        // Default classification
        if (openPorts.size() > 5)
            return "Server/Network Device";
        if (openPorts.size() > 2)
            return "Computer/Device";
        return "Network Device";
    }

    private List<String> assessDeviceSecurity(List<Map<String, Object>> openPorts) {
        List<String> notes = new ArrayList<>();

        for (Map<String, Object> portInfo : openPorts) {
            int port = (Integer) portInfo.get("port");
            String risk = (String) portInfo.get("riskLevel");
            String service = (String) portInfo.get("service");

            switch (risk) {
                case "HIGH":
                    notes.add("⚠️ HIGH RISK: " + service + " (port " + port + ") - Consider securing or disabling");
                    break;
                case "MEDIUM":
                    notes.add("🔶 MEDIUM RISK: " + service + " (port " + port + ") - Ensure strong authentication");
                    break;
            }
        }

        // Additional security checks
        boolean hasTelnet = openPorts.stream().anyMatch(p -> (Integer) p.get("port") == 23);
        boolean hasFTP = openPorts.stream().anyMatch(p -> (Integer) p.get("port") == 21);
        boolean hasRDP = openPorts.stream().anyMatch(p -> (Integer) p.get("port") == 3389);

        if (hasTelnet) {
            notes.add("🚨 CRITICAL: Telnet is unencrypted - switch to SSH");
        }
        if (hasFTP) {
            notes.add("⚠️ WARNING: FTP may transmit passwords in plain text");
        }
        if (hasRDP) {
            notes.add("🔐 INFO: RDP detected - ensure strong passwords and limit access");
        }

        if (notes.isEmpty()) {
            notes.add("✅ No major security concerns detected");
        }

        return notes;
    }
}
