package org.example.web3;

import javax.management.MBeanServer;
import javax.management.ObjectName;
import java.lang.management.ManagementFactory;

public class MBeanRegistry {

    public static void registerBean(Object bean, String name) {
        try {
            MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
            ObjectName objectName = new ObjectName("org.example.web3:type=" + name);
            if (!mbs.isRegistered(objectName)) {
                mbs.registerMBean(bean, objectName);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static void unregisterBean(Object bean, String name) {
        try {
            MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
            ObjectName objectName = new ObjectName("org.example.web3:type=" + name);
            if (mbs.isRegistered(objectName)) {
                mbs.unregisterMBean(objectName);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
